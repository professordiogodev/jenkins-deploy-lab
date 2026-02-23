pipeline {
    agent any

    tools {
        nodejs 'node-20'
    }

    environment {
        APP_SERVER = 'ubuntu@172.31.41.248'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy to EC2') {
            when {
                branch 'main'
            }
            steps {
                sshagent(credentials: ['app-server-ssh-key']) {
                    sh '''
                        chmod +x deploy.sh
                        ./deploy.sh $APP_SERVER $SSH_KEY_FILE
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            cleanWs()
        }
    }
}