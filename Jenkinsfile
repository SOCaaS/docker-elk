pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                echo 'Installing....'
                sh 'curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose'
                sh 'chmod +x /usr/bin/docker-compose'
                sh '/usr/bin/docker-compose --version'
            }
        }
        stage('Build & Deploy') {
            steps {
                echo 'Building & Deploying....'
                sh 'TAG=${BUILD_NUMBER} /usr/bin/docker-compose -p "elk" up -d --build'
            }
        }
    }
    post {
        success {
            discordSend description: "Build Success", footer: "ELK Server", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: env.SOCAAS_WEBHOOK
        }
        failure {
            discordSend description: "Build Failed", footer: "ELK Server", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: env.SOCAAS_WEBHOOK
        }
    }
}