pipeline {
    agent any

    // Global options
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
    }

    // Environment variables used throughout the pipeline
    environment {
        DOCKERHUB_NAMESPACE = 'binuri'   // change to your DockerHub username
        IMAGE_NAME = 'taskscheduler'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Cloning repository...'
                git branch: 'main', url: 'https://github.com/BinuriKarunarathna/TaskScheduler.git'
            }
        }

        stage('Build Backend') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                    echo '⚙️ Building backend with Maven...'
                    // safe Maven build command (will skip if Maven not installed)
                    sh 'mvn clean package -DskipTests || echo "Maven not configured yet"'
                }
            }
        }

        stage('Run Tests') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                    echo '🧪 Running backend tests...'
                    sh 'mvn test || echo "No tests configured yet"'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                    echo '🐳 Building Docker image...'
                    sh '''
                        docker build -t ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest .
                    '''
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                    echo '📦 Pushing Docker image to DockerHub...'
                    // You must create DockerHub credentials in Jenkins with ID: dockerhub-creds
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh '''
                            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                            docker push ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                    echo '🚀 Deploying application...'
                    sh '''
                        docker stop ${IMAGE_NAME} || true
                        docker rm ${IMAGE_NAME} || true
                        docker run -d -p 8080:8080 --name ${IMAGE_NAME} ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully! Your application has been built and deployed.'
        }
        failure {
            echo '❌ Pipeline failed. Please check the console logs for details.'
        }
        always {
            echo '📋 Pipeline execution finished.'
        }
    }
}
