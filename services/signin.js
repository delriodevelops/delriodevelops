import checkLocalStorage from './checkLocalStorage'

export default async function useSignIn(user,pass){
    console.log('signin')    
    if(user===process.env.USER && pass===process.env.PASS){
        console.log('correcto')
        localStorage.setItem('user',JSON.stringify(user))
        const localUser = await checkLocalStorage('user')
        console.log(localUser)
        if(!!localUser){window.location.replace('/messages')}
    }
}