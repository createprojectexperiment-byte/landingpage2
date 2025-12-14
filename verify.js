const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ success: false, error: 'Password required' });
      }
      
      // Password yang sudah di-hash (akan diganti dengan hash kamu)
      // Untuk membuat hash password kamu: bcrypt.hashSync('passwordkamu', 10)
      const hashedPassword = process.env.EDITOR_PASSWORD_HASH;
      
      // Verifikasi password
      const isValid = await bcrypt.compare(password, hashedPassword);
      
      if (isValid) {
        // Generate simple token
        const token = Buffer.from(Date.now() + process.env.EDITOR_SECRET).toString('base64');
        res.json({ success: true, token });
      } else {
        res.json({ success: false, error: 'Invalid password' });
      }
    } catch (error) {
      console.error('Verify error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
