import {useForm} from "react-hook-form"

export const LoginForm = ({onForgot}) => {
    const {
        register,
        // handleSubmit,
        formState: {errors},
    }= useForm();

  return (
    <form className="space-y-5">
        <div>
            <label 
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-800 mb-1.5"
            >
                Email o Username
            </label>
            <input 
                type="text"
                id="emailOrUsername"
                placeholder="correo@example.com o Username"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {
                    ...register("emailOrUsername",{
                        required: "Este campo es obligatorio"
                    })
                }
            />
            {errors.emailOrUsername && (
                <p className="text-red-600 text-xs mt-1">
                    {errors.emailOrUsername.message}
                </p>
            )}
        </div>

        <div>
            <label 
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-1.5"
            >
                Constraseña
            </label>
            <input 
                type="password"
                id="password"
                placeholder="* * * * * * *"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {
                    ...register("password",{
                        required: "Este campo es obligatorio"
                    })
                }
            />

            {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                    {errors.password.message}
                </p>
            )}
        </div>

        <button
            type="submit"
            className="w-full bg-main-blue hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
            Iniciar Sesión
        </button>
        <p className="text-center text-sm">
            <button
                type="button"
                onClick={onForgot}
                className = 'text-main-blue hover:underline hover:cursor-pointer'
            >
                ¿Olvidaste tu contraseña?
            </button>
        </p>
    </form>
  )
}
