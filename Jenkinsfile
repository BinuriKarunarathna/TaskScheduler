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
        IMAGE_TAG      = "${BUILD_NUMBER}"

        DEPLOY_USER = 'ec2-user'
        DEPLOY_HOST = '13.235.8.85'
        DEPLOY_PATH = '/home/ec2-user/TaskScheduler'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Docker Test') {
            steps {
                sh 'docker --version'
                sh 'docker ps'
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
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG -t $DOCKERHUB_USER/$BACKEND_IMAGE:latest backend
                docker push $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG
                docker push $DOCKERHUB_USER/$BACKEND_IMAGE:latest
                '''
            }
        }

        stage('Build & Push Frontend') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG -t $DOCKERHUB_USER/$FRONTEND_IMAGE:latest frontend
                docker push $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG
                docker push $DOCKERHUB_USER/$FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ec2-user@13.235.8.85 "
                        cd /home/ec2-user/TaskScheduler &&
                        git pull origin main &&
                        docker-compose down &&
                        docker-compose up -d --build
                    "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD completed successfully"
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
