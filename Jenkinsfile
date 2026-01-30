pipeline {
    agent any

    environment {
        DOCKER_USER    = 'binuri1234'
        BACKEND_IMAGE  = 'taskmanager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend'
        IMAGE_TAG      = 'latest'
        EC2_HOST       = '13.235.8.85'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/BinuriKarunarathna/TaskScheduler.git'
            }
        }

        stage('Build & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    
                    # Build and Tag
                    docker build -t $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG backend
                    docker build -t $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG frontend
                    
                    # Push
                    docker push $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG
                    docker push $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ec2-user@$EC2_HOST "
                        cd ~/TaskScheduler &&
                        git pull origin main &&
                        docker-compose pull &&
                        docker-compose up -d
                    "
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
