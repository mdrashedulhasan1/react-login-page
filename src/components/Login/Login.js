import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from "react-hook-form";
import Loading from '../Shared/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Login = () => {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    useEffect(() => {
        if (user || gUser) {
            console.log(user || gUser);
            navigate(from, { replace: true });
        }
    })
    if (loading || gLoading) {
        return <Loading></Loading>
    }
    let errorMessage;
    if (error || gError) {
        errorMessage = <p className='text-red-500'>{error?.message || gError?.message}</p>
    }
    const onSubmit = (data) => {
        console.log(data);
        signInWithEmailAndPassword(data.email, data.password);
    };
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-cebter text-2xl font-bold">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Please Fill Required Field'
                                    },
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/,
                                        message: 'Please Give a Valid Email' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span>{error.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span>{error.email.message}</span>}
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Please Fill Required Field'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'error message' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.password?.type === 'required' && <span>{error.password.message}</span>}
                                {errors.password?.type === 'minLength' && <span>{error.password.message}</span>}
                            </label>
                        </div>
                        {errorMessage}
                        <input className="btn btn-secondary w-full" type="submit" value='Login' />
                        <p><small>New to Website? <Link to='/signup' className='text-primary'>Create A New Account</Link></small></p>
                    </form>
                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-accent">Continue With Google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;