// api/buy/[productId].js (untuk Vercel Functions: /api/buy/:productId)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const productId = req.query.productId || req.url.split('/').pop();
  
  try {
    // Ambil data produk dari Supabase
    const { data, error } = await supabase
      .from('landing_pages')
      .select('data')
      .eq('id', 'main')
      .single();
    
    if (error) throw error;
    
    const products = data.data.products || [];
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product && product.lynkUrl) {
      // Redirect ke Lynk.id
      res.json({ success: true, url: product.lynkUrl });
    } else {
      // Default fallback
      res.json({ success: true, url: process.env.DEFAULT_LYNK_URL || 'https://lynk.id/melekfinansial.id/xo5e1w94vo34' });
    }
  } catch (error) {
    console.error('Buy error:', error);
    res.json({ success: true, url: process.env.DEFAULT_LYNK_URL || 'https://lynk.id/melekfinansial.id/xo5e1w94vo34' });
  }
};
