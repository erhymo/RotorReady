#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting automated deployment process...\n');

// Clean up project first
console.log('🧹 Cleaning up project...');
try {
  const toRemove = ['rotorready-clean', 'app/output.css'];
  toRemove.forEach(item => {
    const itemPath = path.join(process.cwd(), item);
    if (fs.existsSync(itemPath)) {
      fs.rmSync(itemPath, { recursive: true, force: true });
      console.log(`✓ Removed ${item}`);
    }
  });
} catch (error) {
  console.warn('⚠️ Some cleanup items not found, continuing...');
}

// Build and test locally first
console.log('\n🔨 Building project locally...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Local build successful!');
} catch (error) {
  console.error('❌ Build failed. Please fix errors before deploying.');
  process.exit(1);
}

// Git operations
console.log('\n📦 Preparing Git commit...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy: Optimize project for production deployment"', { stdio: 'inherit' });
  console.log('✅ Git commit created');
} catch (error) {
  console.log('ℹ️ No changes to commit or already committed');
}

// Push to GitHub
console.log('\n🌐 Pushing to GitHub...');
try {
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to GitHub!');
} catch (error) {
  console.error('❌ Failed to push to GitHub. Make sure remote is set up.');
  console.log('Run: git remote add origin https://github.com/your-username/rotorready.git');
  process.exit(1);
}

console.log('\n🎉 Deployment process completed!');
