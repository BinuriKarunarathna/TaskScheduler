// pipeline {
//     agent any

//     options {
//         timestamps()
//         disableConcurrentBuilds()
//         skipDefaultCheckout(true)
//     }

//     environment {
//         AWS_REGION     = "ap-south-1"
//         AWS_ACCOUNT_ID = "808985146141"

//         BACKEND_REPO  = "devops-project-backend"
//         FRONTEND_REPO = "devops-project-frontend"

//         ECR_BACKEND  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
//         ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
//     }

//     stages {

//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Login to AWS ECR') {
//             steps {
//                 sh '''
//                 aws ecr get-login-password --region $AWS_REGION \
//                 | docker login --username AWS --password-stdin \
//                 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
//                 '''
//             }
//         }

//         stage('Build & Push Images') {
//             parallel {

//                 stage('Backend') {
//                     steps {
//                         sh '''
//                         echo "🔹 Building Backend..."

//                         docker pull $ECR_BACKEND:latest || true

//                         docker build \
//                           --cache-from $ECR_BACKEND:latest \
//                           -t $ECR_BACKEND:latest ./backend

//                         docker push $ECR_BACKEND:latest
//                         '''
//                     }
//                 }

//                 stage('Frontend') {
//                     steps {
//                         sh '''
//                         echo "🔹 Building Frontend..."

//                         # Keep Jenkins alive during heavy React build
//                         ( while true; do echo "Frontend build still running..."; sleep 30; done ) &
//                         KEEPALIVE_PID=$!

//                         docker pull $ECR_FRONTEND:latest || true

//                         docker build \
//                           --memory=512m \
//                           --cache-from $ECR_FRONTEND:latest \
//                           -t $ECR_FRONTEND:latest ./frontend

//                         kill $KEEPALIVE_PID

//                         docker push $ECR_FRONTEND:latest
//                         '''
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Backend & Frontend images pushed to ECR successfully"
//         }
//         failure {
//             echo "❌ Pipeline failed"
//         }
//         always {
//             sh 'docker image prune -f || true'
//         }
//     }
// }


pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_USER = 'binuri1234'
        BACKEND_IMAGE  = 'taskmanager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend'
        DEPLOY_USER = 'ec2-user'
        DEPLOY_HOST = '13.235.8.85'   // App EC2 public IP
        DEPLOY_PATH = '/home/ec2-user/TaskScheduler'


    }
    
    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Test') {
            steps {
                bat 'docker --version'
                bat 'docker ps'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                bat '''
                docker build -t %DOCKERHUB_USER%/%BACKEND_IMAGE%:latest backend
                docker push %DOCKERHUB_USER%/%BACKEND_IMAGE%:latest
                '''
            }
        }

        stage('Build & Push Frontend') {
            steps {
                bat '''
                docker build -t %DOCKERHUB_USER%/%FRONTEND_IMAGE%:latest frontend
                docker push %DOCKERHUB_USER%/%FRONTEND_IMAGE%:latest
                '''
            }
        }
        stage('Deploy to EC2 (CD)') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} << 'EOF'
                        cd ${DEPLOY_PATH}
                        docker-compose pull
                        docker-compose up -d
                        docker ps
                    EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI completed successfully"
        }
        always {
            bat 'docker image prune -f'
        }
    }
}
