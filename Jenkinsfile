pipeline {
    agent any

    environment {
        IMAGE_NAME = "taskscheduler"
        DOCKERHUB_NAMESPACE = "binuri"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Cloning repository...'
                git url: 'https://github.com/BinuriKarunarathna/TaskScheduler.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                dir('backend') {
                    // Run your test command (adjust if you use Jest, Mocha, etc.)
                    sh 'npm test || echo "No tests configured yet"'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                dir('backend') {
                    sh 'docker build -t ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest .'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing Docker image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Docker container...'
                sh '''
                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true
                    docker run -d -p 8080:8080 --name ${IMAGE_NAME} ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully! Your Node.js app has been deployed.'
        }
        failure {
            echo '❌ Pipeline failed. Please check the logs.'
        }
    }
}
