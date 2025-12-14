// api/data.js (untuk Vercel Functions: /api/data)
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Handler untuk /api/data
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    try {
      // Ambil data dari Supabase
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', 'main')
        .single();
      
      if (error) throw error;
      
      if (data) {
        res.json(data.data);
      } else {
        // Data default
        res.json({
          hero: {
            title: "Ubah Skill Jadi Cuan Digital",
            subtitle: "Produk digital premium untuk hasil maksimal"
          },
          products: [
            {
              id: 1,
              title: "Digital Marketing Mastery",
              price: "Rp 299.000",
              oldPrice: "Rp 500.000",
              description: "Belajar dari nol hingga mahir",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
            },
            {
              id: 2,
              title: "Web Development Bootcamp",
              price: "Rp 399.000",
              oldPrice: "Rp 750.000",
              description: "Kuasai web development dalam 30 hari",
              image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
            }
          ],
          testimonials: [
            {
              id: 1,
              name: "Sarah Wijaya",
              role: "Digital Marketer",
              text: "Penghasilan saya naik 300% setelah ikut program ini!",
              image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
            },
            {
              id: 2,
              name: "Budi Santoso",
              role: "Freelancer",
              text: "Sekarang bisa dapat client dari luar negeri!",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
