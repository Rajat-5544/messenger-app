'use client';
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type variant= 'LOGIN' | 'REGISETER';
const AuthForm = () => {
    const [variant, setVariant] = useState<variant>('LOGIN');
    const [isLoading, setisLoading] = useState(false);

    const toggleVariant = useCallback(()=>{
        if(variant == 'REGISETER'){
            setVariant('LOGIN')
        }
        else{
            setVariant('REGISETER')
        }
    },[variant])

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email:'',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setisLoading(true);

        if(variant == 'REGISETER'){
            axios.post('/api/register', data)
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setisLoading(false))
        }

        if(variant == "LOGIN"){
            signIn('credentials',{
                ...data,
                redirect: false
            })
            .then((callback) => {
                if(callback?.error){
                    toast.error('Invalid credentials');
                }

                if(callback?.ok && !callback?.error) {
                    toast.success('Logged in!')
                }
            })
            .finally(() => setisLoading(false))
        }
    }

    const socialAction = (action: string) => {
        setisLoading(true)

        signIn(action, { redirect: false })
        .then((callback) => {
            if(callback?.error){
                toast.error('Invalid credentials');
            }

            if(callback?.ok && !callback?.error) {
                toast.success('Logged in!')
            }
        })
        .finally(() => setisLoading(false));
    }

    return(
        <div
        className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        ">
            <div
            className="
               bg-white
               px-4
               py-8
               shadow
               sm:rounded-lg
               sm:px-10 
            ">
                <form 
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant == 'REGISETER' && (
                    <Input 
                        id="name" 
                        label="name" 
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    )}
                    <Input 
                        id="email" 
                        label="Email address"
                        type="email" 
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <Input 
                        id="password" 
                        label="Password"
                        type="password" 
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {variant =="LOGIN" ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                        "
                        >
                            <div 
                            className="
                                w-full 
                                border-t
                                border-gray-300
                            "/>
                        </div>
                        <div className="
                            relative
                            flex
                            justify-center
                            text-sm
                        ">
                            <span className="
                                bg-white
                                px-2
                                text-gray-500
                            ">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="
                        mt-6
                        flex
                        gap-2
                    ">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>

                <div className="
                    flex
                    gap-2
                    justify-center
                    text-sm
                    mt-6
                    px-2
                    text-gray-500
                ">
                    <div>
                        {variant == 'LOGIN' ? 'New to Messenger?' : 'Already have account?'}
                    </div>
                    <div
                    onClick={toggleVariant}
                    className="
                        underline
                        cursor-pointer
                    "
                    >
                        {variant == 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;