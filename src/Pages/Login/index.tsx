import images from "../../assets/images";
import icons from "../../assets/icons/Index";
import { auth } from "../../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import config from "../../config/api";
import { useAuth } from "../../context/AuthContext";

interface LoginProps {
    navigateTo?: string;
}

const Login = ({ navigateTo }: LoginProps) => {
    const { login } = useAuth();
    const navigation = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user as { displayName?: string; accessToken?: string };
            const firebaseToken = user?.accessToken ?? "";
            // console.log("fireabseToken:", firebaseToken)
            const response = await fetch(`${config.baseUrl}/accounts/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: firebaseToken
                })
            })
            const responseBody = await response.json();

            login();
            localStorage.setItem("accessToken", responseBody.access_token);
            navigation(navigateTo ?? "/home");
        } catch (err) {
            console.error(err);
            alert("Sorry could not login");
        }
    };

    return (
        <div className="h-screen flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="flex justify-center items-center bg-gradient-to-r from-[#475a84] via-[#203a6e] to-[#1c315d] w-full lg:w-1/2 relative">
                <img src={images.LoginBackGroundImages} alt="hr-gpt" className="h-full w-full mix-blend-overlay absolute" />
                <div className="p-24 flex flex-col items-start text-[#FFFFFF]">
                    <img src={icons.StarIcons} alt="star" className="object-cover" />
                    <h1 className="text-4xl mt-8">Welcome back</h1>
                    <p className="mt-2">Create a free account and get full access to all features</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-center items-center font-inter w-full lg:w-1/2  relative">
                <div className="w-full lg:w-[70%] xl:w-[80%] flex flex-col justify-center items-center p-6 lg:p-16 bg-white">
                    <div className="flex flex-col">
                        <h1 className='text-4xl font-semibold'>
                            Welcome back
                        </h1>
                        <p className="text-[#969696] text-center mt-3">Login to continue</p>
                    </div>

                    <button className="my-4 w-full flex gap-4 items-center justify-center rounded-lg border-2 border-gray-border hover:bg-gray-100 bg-white py-3 px-3 shadow-sm md:w-4/5" onClick={signInWithGoogle}>
                        <img className="w-6 h-6" src={icons.GoogleIcons} alt="Google" />
                        <span className="text-lg text-black-light">
                            Sign in with Google
                        </span>
                    </button>

                    {/* <div className="flex w-full items-center gap-2 py-2 text-sm text-slate-600 md:w-4/5">
                        <div className="h-px w-full bg-gray-border"></div>
                        OR
                        <div className="h-px w-full bg-gray-border"></div>
                    </div>

                    <button className="my-4 w-full flex gap-4 items-center justify-center rounded-lg border border-gray-border hover:bg-gray-100 bg-white py-3 px-3 shadow-sm md:w-4/5">
                        <img className="w-6 h-6" src={icons.AppleIcons} alt="Apple" />
                        <span className="text-lg text-black-light">
                            Sign in with Apple
                        </span>
                    </button> */}

                    {/* <p className="text-base mt-8 text-center font-normal text-[#6C6C6C]">
                        Need an account?{" "}
                        <button
                            className="underline font-semibold text-blue"
                        //   onClick={() => setFlow("register")}
                        >
                            Create one
                        </button>
                    </p> */}
                </div>
                <p className="absolute bottom-[-20px] lg:bottom-4 text-sm text-[#AEAEAE]">Terms of use | Privacy policy</p>
            </div>
        </div>
    );
}

export default Login;
