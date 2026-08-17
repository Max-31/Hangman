pipeline {
    agent {
        label 'docker-agent-nodejs'
    }

    environment {
        PROJECT_NAME = 'Hangman'
        DB_NAME      = 'Hangman-Cluster'
        
        DOCKER_IMAGE = 'max3101/hangman-backend'
        // DEPLOY_DIR   = '/srv/mern-app'
        DEPLOY_DIR = '/home/jenkins/hangman-production'

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('server') {
                    sh '''
                        docker build \
                            -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                            -t ${DOCKER_IMAGE}:latest \
                            .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'deployment-user-ssh-creds',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    ),
                    string(credentialsId: 'mongo-db-uri', variable: 'MONGO_URI'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                        set +x
                        echo "Deploying ${PROJECT_NAME} build ${IMAGE_TAG}"

                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@34.45.15.61" "mkdir -p ${DEPLOY_DIR}"

                        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server/docker-compose.yaml "$SSH_USER@34.45.15.61:${DEPLOY_DIR}/docker-compose.yaml"

                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@34.45.15.61" "cat > ${DEPLOY_DIR}/.env" <<EOF
                        IMAGE_TAG=${IMAGE_TAG}
                        MONGO_URI=${MONGO_URI}
                        JWT_SECRET=${JWT_SECRET}
                        PORT=5000
                        EOF

                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@34.45.15.61" "cd ${DEPLOY_DIR} && docker compose pull && docker compose up -d --remove-orphans"
                        
                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@34.45.15.61" "docker image prune -f"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful: ${DOCKER_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}