import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { AppBar, Box, Button, CardContent, CardMedia, Divider, IconButton, Toolbar, Typography } from '@mui/material'
import Image from 'next/image'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useContext } from 'react'
import { getSession } from 'next-auth/react'
import { FormProvider, useForm } from 'react-hook-form'

import logoMtto from '../../public/mtto.png'
import { FormData, useLogin } from '../../hooks'
import { UIContext } from '../../context'
import {
    AuthLayout,
    CardContentAuth,
    ContainerBodyAuth,
    WrapperAuth,
    WrapperAuthBody,
    WrapperAuthHeader,
    WrapperCardAuth,
} from '../../components'
import { InputText, InputPassword } from '../../components/ui/inputs'
import { ITheme } from '../../interface'

const LoginPage: NextPage<ITheme> = ({ toggleTheme }) => {
    const { theme, changeTheme } = useContext(UIContext)
    const { onLoginUser, formsMethods } = useLogin()

    const { control, handleSubmit: onSubmit } = useForm<FormData>({
        defaultValues: {
            email: '',
            contrasena: '',
        },
    })

    const handleChangeTheme = (theme: 'light' | 'dark') => {
        toggleTheme(theme)
        changeTheme(theme)
    }

    return (
        <AuthLayout title="Login">
            <WrapperAuth
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#e3f2fd',
                }}
            >
                <WrapperAuthHeader color="primary">
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar color="inherit" position="static">
                            <Toolbar>
                                <Typography component="div" sx={{ flexGrow: 1 }} variant="h6" />
                                {theme === 'dark' ? (
                                    <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => handleChangeTheme('light')}>
                                        <Brightness7Icon />
                                    </IconButton>
                                ) : (
                                    <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => handleChangeTheme('dark')}>
                                        <Brightness4Icon />
                                    </IconButton>
                                )}
                                <IconButton color="inherit" sx={{ ml: 1 }} />
                            </Toolbar>
                        </AppBar>
                    </Box>
                </WrapperAuthHeader>
                <WrapperAuthBody color="primary">
                    <ContainerBodyAuth>
                        <WrapperCardAuth>
                            <CardContentAuth>
                                <CardMedia sx={{ width: '100%' }}>
                                    <Image alt="logoMtto" layout="responsive" src={logoMtto} />
                                </CardMedia>
                                <CardContent>
                                    <Typography align="center" color="secondary" sx={{ fontWeight: 'bold' }} variant="h6">
                                        Hola, bienvenido a el panel admin de mtto
                                    </Typography>
                                    <Typography
                                        align="center"
                                        color="text.disabled"
                                        sx={{ fontWeight: 'bold', mt: 1 }}
                                        variant="body1"
                                    >
                                        Entre con sus credenciales a continuaci??n
                                    </Typography>
                                </CardContent>
                                <Divider flexItem orientation="horizontal" variant="middle" />
                                <FormProvider {...formsMethods}>
                                    <CardContent sx={{ display: 'flex', marginTop: '20px' }}>
                                        <InputText fullWidth control={control} label="Email" name="email" type="email" />
                                    </CardContent>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <InputPassword fullWidth control={control} label="Contrase??a" name="contrasena" />

                                        <Button
                                            fullWidth
                                            color="secondary"
                                            size="large"
                                            sx={{ mt: 3 }}
                                            variant="contained"
                                            onClick={onSubmit(onLoginUser)}
                                        >
                                            Ingresar
                                        </Button>
                                    </CardContent>
                                </FormProvider>
                                <Divider flexItem orientation="horizontal" variant="middle" />
                                <CardContent>
                                    <Typography
                                        align="center"
                                        color="text.disabled"
                                        sx={{ fontWeight: 'bold', mt: 1, fontSize: '0.8rem' }}
                                        variant="subtitle2"
                                    >
                                        Si no se acuerda de sus credenciales le recomendamos que se comunique con un superior para
                                        informar la situaci??n
                                    </Typography>
                                </CardContent>
                            </CardContentAuth>
                        </WrapperCardAuth>
                    </ContainerBodyAuth>
                </WrapperAuthBody>
            </WrapperAuth>
        </AuthLayout>
    )
}

//con esto buscamos bloquear la pag de login en caso tal tengamos credenciales
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req })
    //console.log(session,session);
    //con el query rescatamos el ultimo path donde estuvimos navegando parar retornarlo en caso tal nuestro logueo sea exitoso
    const { p = '/' } = query

    if (session) {
        return {
            redirect: {
                //no moleste la funci??n ponemos para que nos devuelva un string en caso tal venga un array  colocamos.toString()
                destination: p.toString(),
                permanent: false,
            },
        }
    }

    //si nosotros no tenemos una session pues nos quedamos en esta pantalla y se devuelven las props
    return {
        props: {},
    }
}

export default LoginPage
