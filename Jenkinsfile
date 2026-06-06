pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_USER    = 'binuri1234'
        BACKEND_IMAGE  = 'taskmanager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend'
        IMAGE_TAG      = 'latest'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/BinuriKarunarathna/TaskScheduler.git'
            }
        }

        stage('Get EC2 IP') {
            steps {
                script {
                    env.EC2_HOST = sh(
                        script: 'cat /var/lib/jenkins/ec2_ip.txt',
                        returnStdout: true
                    ).trim()
                    echo "Deploying to EC2: ${env.EC2_HOST}"
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker build -t $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG ./backend
                        docker build -t $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG ./frontend
                        docker push $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG
                        docker push $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                    ssh -i /var/lib/jenkins/jenkins-key.pem \
                        -o StrictHostKeyChecking=no \
                        -o ConnectTimeout=10 \
                        ubuntu@${env.EC2_HOST} '
                        cd ~/TaskScheduler &&
                        git pull origin main &&
                        docker-compose down &&
                        docker-compose pull &&
                        docker-compose up -d --remove-orphans
                    '
                """
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed. Check console output.'
        }
    }
}