pipeline {
  agent any

  parameters {
    booleanParam(name: 'SMOKE_TEST', defaultValue: false, description: 'Run docker-compose smoke test after build')
  }

  options {
    skipDefaultCheckout(true)
    timestamps()
    ansiColor('xterm')
  }

  environment {
    // Set this in the Jenkins job configuration (e.g., your Docker Hub username/namespace)
    // Example: BinuriKarunarathna
    DOCKERHUB_NAMESPACE = env.DOCKERHUB_NAMESPACE
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Validate env') {
      steps {
        script {
          if (!env.DOCKERHUB_NAMESPACE) {
            error 'Missing DOCKERHUB_NAMESPACE. Set it in the Jenkins job config (e.g., your Docker Hub username).'
          }
        }
        echo "Docker namespace: ${env.DOCKERHUB_NAMESPACE}"
      }
    }

    stage('Compute version') {
      steps {
        script {
          env.SHORT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }
        echo "Version (short SHA): ${env.SHORT_SHA}"
      }
    }

    stage('Docker login (main only)') {
      when { branch 'main' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin'
          script { echo "Logged in to Docker Hub as ${DOCKERHUB_USER}" }
        }
      }
    }

    stage('Build images') {
      steps {
        sh label: 'Build backend', script: """
          set -euxo pipefail
          docker build -t ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA} backend
        """
        sh label: 'Build db', script: """
          set -euxo pipefail
          docker build -t ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA} db
        """
        sh label: 'Build frontend', script: """
          set -euxo pipefail
          docker build -t ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA} frontend
        """
      }
    }

    stage('Push images (main only)') {
      when { branch 'main' }
      steps {
        sh label: 'Tag latest', script: """
          set -euxo pipefail
          docker tag ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-backend:latest
          docker tag ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-db:latest
          docker tag ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA} ${DOCKERHUB_NAMESPACE}/devops-frontend:latest
        """
        sh label: 'Push tags', script: """
          set -euxo pipefail
          docker push ${DOCKERHUB_NAMESPACE}/devops-backend:${SHORT_SHA}
          docker push ${DOCKERHUB_NAMESPACE}/devops-db:${SHORT_SHA}
          docker push ${DOCKERHUB_NAMESPACE}/devops-frontend:${SHORT_SHA}
          docker push ${DOCKERHUB_NAMESPACE}/devops-backend:latest
          docker push ${DOCKERHUB_NAMESPACE}/devops-db:latest
          docker push ${DOCKERHUB_NAMESPACE}/devops-frontend:latest
        """
      }
    }

    stage('Smoke test with docker-compose') {
      when { expression { return params.SMOKE_TEST } }
      steps {
        sh label: 'Up stack', script: """
          set -euxo pipefail
          DOCKERHUB_USERNAME=${DOCKERHUB_NAMESPACE} docker compose pull
          DOCKERHUB_USERNAME=${DOCKERHUB_NAMESPACE} docker compose up -d
          echo 'Waiting for services to settle...'
          sleep 20
        """
        sh label: 'Health checks', script: """
          set -euxo pipefail
          curl -fsS http://localhost:5000/api/health/db | tee /tmp/db_health.json
          curl -fsS http://localhost:5000/ | head -c 200 || true
          curl -fsS http://localhost:3000 | head -c 200 || true
        """
      }
      post {
        always {
          sh 'docker compose down -v || true'
        }
      }
    }
  }

  post {
    always {
      // Light cleanup; skip if you want to keep local cache
      sh 'docker image prune -f || true'
    }
  }
}
