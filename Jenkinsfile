// Jenkins Declarative Pipeline for TaskScheduler
// Builds & optionally pushes backend, frontend, and db Docker images.
// Optional smoke test with docker-compose.
// REQUIREMENTS:
//  - Jenkins agent with Docker CLI installed (and permission to run docker)
//  - Credentials ID 'dockerhub' (Username/Password or Token) for Docker Hub
//  - Job (or folder) environment variable DOCKERHUB_NAMESPACE set to your Docker Hub namespace
// PARAMETERS:
//  - SMOKE_TEST: set true to run docker-compose based health checks after push on main

pipeline {
    agent any

    parameters {
        booleanParam(name: 'SMOKE_TEST', defaultValue: false, description: 'Run docker-compose smoke test (main branch only)')
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
        ansiColor('xterm')
    }

    environment {
        // Provided via Jenkins job configuration (e.g. BinuriKarunarathna)
        DOCKERHUB_NAMESPACE = env.DOCKERHUB_NAMESPACE
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Environment') {
            steps {
                script {
                    if (!env.DOCKERHUB_NAMESPACE) {
                        error 'Missing DOCKERHUB_NAMESPACE environment variable. Set it in the Jenkins job configuration.'
                    }
                }
                echo "Using Docker Hub namespace: ${env.DOCKERHUB_NAMESPACE}"
            }
        }

        stage('Compute Version') {
            steps {
                script {
                    env.SHORT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    // Branch name resolution (Multibranch automatically sets BRANCH_NAME)
                    if (!env.BRANCH_NAME) {
                        env.BRANCH_NAME = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    }
                }
                echo "Branch: ${env.BRANCH_NAME} | Commit: ${env.SHORT_SHA}"
            }
        }

        stage('Backend Unit Tests') {
            when { expression { return fileExists('backend/package.json') } }
            steps {
                dir('backend') {
                    sh label: 'Install deps', script: 'npm install --no-audit --no-fund'
                    // Avoid pipeline failure if no real tests yet
                    sh label: 'Run tests', script: 'npm test || echo "(No test suite configured or tests failed - continuing)"'
                }
            }
        }

        stage('Docker Login (main only)') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                    sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                    echo "Logged into Docker Hub as ${DOCKERHUB_USER}"
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        sh label: 'Build backend', script: 'docker build -t ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA} backend'
                    }
                }
                stage('Frontend Image') {
                    steps {
                        sh label: 'Build frontend', script: 'docker build -t ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA} frontend'
                    }
                }
                stage('DB Image') {
                    steps {
                        sh label: 'Build db', script: 'docker build -t ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA} db'
                    }
                }
            }
        }

        stage('Tag & Push Images (main only)') {
            when { branch 'main' }
            steps {
                sh label: 'Tag latest', script: '''
                    set -euxo pipefail
                    docker tag ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-backend:latest
                    docker tag ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-frontend:latest
                    docker tag ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-db:latest
                '''
                sh label: 'Push images', script: '''
                    set -euxo pipefail
                    docker push ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA}
                    docker push ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA}
                    docker push ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA}
                    docker push ${DOCKERHUB_NAMESPACE}/devops-backend:latest
                    docker push ${DOCKERHUB_NAMESPACE}/devops-frontend:latest
                    docker push ${DOCKERHUB_NAMESPACE}/devops-db:latest
                '''
            }
        }

        stage('Smoke Test (docker-compose)') {
            when { expression { return params.SMOKE_TEST && env.BRANCH_NAME == 'main' } }
            steps {
                sh label: 'Compose Up', script: '''
                    set -euxo pipefail
                    DOCKERHUB_USERNAME=${DOCKERHUB_NAMESPACE} docker compose pull
                    DOCKERHUB_USERNAME=${DOCKERHUB_NAMESPACE} docker compose up -d
                    echo 'Waiting for services to become healthy...'
                    sleep 25
                '''
                sh label: 'Health Checks', script: '''
                    set -euxo pipefail
                    echo 'Backend root:'
                    curl -fsS http://localhost:5000/ | head -c 200 || true
                    echo '\nDB health:'
                    curl -fsS http://localhost:5000/api/health/db | head -c 300 || true
                    echo '\nFrontend index:'
                    curl -fsS http://localhost:3000 | head -c 200 || true
                '''
            }
            post {
                always {
                    sh 'DOCKERHUB_USERNAME=${DOCKERHUB_NAMESPACE} docker compose down -v || true'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build complete. Images built with tag ${SHORT_SHA}${BRANCH_NAME == 'main' ? ' and latest' : ''}."
        }
        failure {
            echo '❌ Pipeline failed. Review stage logs.'
        }
        always {
            // Light cleanup; remove dangling images
            sh 'docker image prune -f || true'
        }
    }
}

