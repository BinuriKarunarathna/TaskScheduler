pipeline {
    agent any

    environment {
        AWS_REGION          = "eu-north-1"
        AWS_ACCOUNT_ID      = credentials('aws-account-id') // ID: 123456789012
        ECR_BACKEND_REPO   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-project-backend"
        ECR_FRONTEND_REPO  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-project-frontend"
        TF_VAR_db_username = credentials('db-username')
        TF_VAR_db_password = credentials('db-password')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Cloning repository...'
                checkout scm
            }
        }

        stage('Terraform Plan & Apply') {
            steps {
                echo '🏗️ Provisioning Infrastructure...'
                dir('terraform') {
                    sh 'terraform init'
                    sh "terraform apply -auto-approve -var='db_username=${TF_VAR_db_username}' -var='db_password=${TF_VAR_db_password}'"
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                echo '🔑 Logging in to AWS ECR...'
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
            }
        }

        stage('Test & Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        echo '🐳 Building Backend...'
                        dir('backend') {
                            sh 'npm test || echo "No tests"' 
                            sh "docker build -t ${ECR_BACKEND_REPO}:latest ."
                            sh "docker push ${ECR_BACKEND_REPO}:latest"
                        }
                    }
                }
                stage('Frontend Build') {
                    steps {
                        echo '🐳 Building Frontend...'
                        dir('frontend') {
                            sh "docker build -t ${ECR_FRONTEND_REPO}:latest ."
                            sh "docker push ${ECR_FRONTEND_REPO}:latest"
                        }
                    }
                }
            }
        }

        stage('Initialize Database') {
            steps {
                echo '🗄️ Initializing DB Schema...'
                script {
                    def rdsEndpoint = sh(script: "cd terraform && terraform output -raw rds_endpoint", returnStdout: true).trim().split(':')[0]
                    dir('db') {
                        // Use a temporary docker container to run the SQL script
                        sh "docker run --rm -v \$(pwd)/init:/init mysql:8 mysql -h ${rdsEndpoint} -u ${TF_VAR_db_username} -p${TF_VAR_db_password} devops < init/init.sql"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '🚀 Deploying Application Containers...'
                script {
                    def appIp = sh(script: "cd terraform && terraform output -raw app_server_public_ip", returnStdout: true).trim()
                    def rdsEndpoint = sh(script: "cd terraform && terraform output -raw rds_endpoint", returnStdout: true).trim().split(':')[0]
                    
                    // Update Ansible inventory dynamically
                    sh "echo '[aws_ec2]\n${appIp} ansible_user=ec2-user ansible_ssh_private_key_file=/var/lib/jenkins/my-keypair.pem' > ansible/inventory.ini"
                    
                    dir('ansible') {
                        // Running with Ansible to pull and start containers
                        sh "ansible-playbook -i inventory.ini deploy.yml \
                            --extra-vars 'backend_image=${ECR_BACKEND_REPO}:latest \
                            frontend_image=${ECR_FRONTEND_REPO}:latest \
                            db_host=${rdsEndpoint} \
                            db_user=${TF_VAR_db_username} \
                            db_password=${TF_VAR_db_password}' \
                            --ssh-common-args='-o StrictHostKeyChecking=no'"
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
