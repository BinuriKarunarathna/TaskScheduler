pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "808985146141"

        BACKEND_REPO = "devops-project-backend"
        FRONTEND_REPO = "devops-project-frontend"

        ECR_BACKEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION |
                docker login --username AWS --password-stdin \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build & Push Images') {
            parallel {

                stage('Backend') {
                    steps {
                        sh '''
                        docker pull $ECR_BACKEND:latest || true

                        docker build \
                          --cache-from $ECR_BACKEND:latest \
                          -t $ECR_BACKEND:latest ./backend

                        docker push $ECR_BACKEND:latest
                        '''
                    }
                }

                stage('Frontend') {
                    steps {
                        sh '''
                        docker pull $ECR_FRONTEND:latest || true

                        docker build \
                          --cache-from $ECR_FRONTEND:latest \
                          -t $ECR_FRONTEND:latest ./frontend

                        docker push $ECR_FRONTEND:latest
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Backend & Frontend images pushed to ECR successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
