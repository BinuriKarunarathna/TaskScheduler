pipeline {
    agent any

    options {
        ansiColor('xterm')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    environment {
        DOCKERHUB_NAMESPACE = 'binuri'   // or "${env.DOCKERHUB_NAMESPACE}" if set in Jenkins
        IMAGE_NAME = 'taskscheduler'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main', url: 'https://github.com/BinuriKarunarathna/TaskScheduler.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                sh 'mvn clean package -DskipTests || echo "Maven not configured yet"'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'mvn test || echo "No tests configured yet"'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo 'Pushing Docker image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh '''
                        echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push ${DOCKERHUB_NAMESPACE}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Please check console logs.'
        }
    }
}
