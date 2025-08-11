import { Eye } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

function Login() {

  const [formData, setFormData]= useState({
    email:'',
    password:''
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const [,setAuthUser] = useAuth();

   const handleChange = (e)=>{
      const value = e.target.value;
      const name = e.target.name;

      setFormData({
        ...formData,
        [name]:value
      })
  }


  const handleLogin = async ()=>{
    setLoading(true);
    setError(" ");
    try {
        const {data} = await axios.post("http://localhost:5000/api/v1/user/login",{
            email:formData.email,
            password:formData.password,
        },{
            withCredentials: true
        })
        alert(data.message || " Login Succeeded")
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setAuthUser(data.token);
        navigate("/login")
    } catch (error) {
        const msg = error?.response?.data?.errors || "Login Failed";
        setError(msg);
    }
    finally{
       setLoading(false)
    }
  };

 

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className='bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg'>

                {/* Login */}
                <h1 className='text-white items-center justify-center text-center'>Login</h1>

              

                {/* Email */}

               <div className='mb-4 mt-2'>
                    <input className='w-full bg-transparent border border-gray-600 rounded-md  px-4 py-2  placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="text" name='email' placeholder="Email Address" value={formData.email}  onChange={handleChange} />
                </div>

                {/* Password */}

              <div className='mb-4 mt-2 relative'>
                    <input className='w-full bg-transparent border border-gray-600 rounded-md px-4 py-2  placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="text" name='password' placeholder="Password" value={formData.password}  onChange={handleChange} />
                    <span className='absolute right-3 top-3 text-gray-400'><Eye size={18} /></span>
                </div>

                {/* Error Message */}
                {error && <span className='text-red-600 text-sm mb-4 '>{error}</span>}

                {/* terms & Conditions */}

                <p className='text-xs text-gray-400 mt-2 mb-6 '
                >By Signing up & Loging In, You consent to DeepDive's <a className='underline' href="">Terms of Use</a> and <a className='underline' href="">Privacy Policy</a></p>

                {/* Login Button */}

                <button onClick={handleLogin} disabled={loading} className='w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50'>
                    {loading? "Signing...": "Login"}
                </button>

                {/* Links */}
                <div className='flex justify-between mt-4 text-sm '>
                    <a className='text-[#7a6ff6] hover:underline' href="">Haven't Account?</a>
                    <Link className='text-[#7a6ff6] hover:underline' to="/signup">
                        SignUp
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Login
