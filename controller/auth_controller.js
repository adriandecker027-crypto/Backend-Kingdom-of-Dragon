const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Store additional user data
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      username,
    });

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: data.user.id, email, username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.status(200).json({ user: data.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.status(200).json({
      message: 'Token refreshed successfully',
      session: data.session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
