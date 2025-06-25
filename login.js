// script/auth.js

const supabaseUrl = 'https://gbqgtnukoucxagswqspx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // full key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// LOGIN FUNCTION
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Login successful!");
    window.location.href = "index.html"; // Redirect to dashboard
  }
}

// SIGNUP FUNCTION
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert("Signup failed: " + error.message);
  } else {
    alert("Signup successful! Check your email to confirm.");
  }
}

// LOGOUT FUNCTION
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout failed");
  } else {
    alert("Logged out");
    window.location.href = "login.html";
  }
}

// DISPLAY LOGGED-IN USER (OPTIONAL)
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (user) {
    document.getElementById("user-info").style.display = "block";
    document.getElementById("auth-area").style.display = "none";
    document.getElementById("user-email").textContent = user.email;
  }
});
