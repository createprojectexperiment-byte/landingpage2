import { createClient } from '@supabase/supabase-js';

// This is a Vercel Serverless Function.
// This file MUST be placed in a new top-level /api directory.

export default async function handler(req, res) {
  // On Vercel, server-side functions read environment variables from process.env.
  // These do NOT need the VITE_ prefix.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: "Supabase server environment variables not set." });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // We only want to handle GET requests for this public endpoint.
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  try {
    // Fetch products and testimonials in parallel for better performance.
    const [productsPromise, testimonialsPromise] = [
      supabase.from('products').select('*').order('position', { ascending: true }),
      supabase.from('testimonials').select('*').order('position', { ascending: true })
    ];

    const [{ data: products, error: productsError }, { data: testimonials, error: testimonialsError }] = await Promise.all([productsPromise, testimonialsPromise]);

    if (productsError) throw productsError;
    if (testimonialsError) throw testimonialsError;
    
    // This is the magic! Cache the data for 24 hours (86400 seconds).
    // This dramatically reduces database calls, keeping you safely in the free tier.
    // s-maxage=86400: Cache for 24 hours on Vercel's Edge Network.
    // stale-while-revalidate=86400: If a request comes after 24 hours, serve the old (stale) data
    // instantly, then fetch fresh data in the background for the next visitor.
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    
    return res.status(200).json({ products: products || [], testimonials: testimonials || [] });

  } catch (error) {
    console.error('Error fetching data from Supabase:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
