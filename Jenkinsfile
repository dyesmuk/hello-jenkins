pipeline {
    agent any

    tools {
        nodejs 'nodejs-18'
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "vamandeshmukh/hello-jenkins"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        JEST_JUNIT_OUTPUT_DIR  = 'test-results'
        JEST_JUNIT_OUTPUT_NAME = 'junit.xml'
    }

    stages {

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install & Test') {
            steps { sh 'npm install && npm test' }
            post {
                always { junit 'test-results/junit.xml' }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | \
                    docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy') {
            steps {
                sh "docker rm -f hello-jenkins || true"
                sh "docker run -d --name hello-jenkins -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

    }

    post {
        success { echo "Build ${BUILD_NUMBER} deployed. App running at http://localhost:3000" }
        failure { echo "Build ${BUILD_NUMBER} failed." }
    }
}