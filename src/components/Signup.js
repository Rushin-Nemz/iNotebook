import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"", email: "" , password: "", cpassword:""});
    let navigate = useNavigate();
    // const handelSignup = async (e)=>{
    //     e.preventDefault();
    //     console.log("signup clicked");
    // }
    const handelSignup = async (e)=>{
        e.preventDefault();
        const {name, email, password} = credentials; 
        const response = await fetch("http://localhost:5000/api/auth/creatuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password}),
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            // save the auth token and redirect
            localStorage.setItem('token', json.authToken);  
            navigate("/");
            props.showAlert("Account Created Successfully", "success");
        }
        else{
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    return (
        <div className="container mt-3">
            <h1>Create an Account to use iNnotebook</h1>
            <form onSubmit={handelSignup}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Enter Your Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign-Up</button>
            </form>
        </div>
    )
}

export default Signup
