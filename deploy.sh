echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* lrmds@172.16.0.26:/var/www/ticketing-app/


echo "HAHAHA TAPOS NA HAHAHAHAH ARN"