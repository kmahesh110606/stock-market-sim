export const SERVER_HOST = "20.193.154.69:8080"
// export const SERVER_HOST = "localhost:8000"

export const makeRequest = async(
    path: string,
    method: RequestInit['method'],
    data?: Record<string, unknown>,
    includeAuth: boolean = false
) => {
    const token = localStorage.getItem('token')
    if (includeAuth && !token) return { "detail": { "message": "You are not logged in" } };

    const res = await fetch(`http://${SERVER_HOST}/${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(includeAuth ? { 'Authorization': 'Bearer ' + token } : {})
        },
        ...(data ? { body: JSON.stringify(data) } : {})
    })

    return (await res.json()) ?? { "detail": { "message": "Request failed" } }
}


export const getFormData = async (form: HTMLFormElement) => {
    const res: Record<string, string> = {}
    form.querySelectorAll('input').forEach((input) => {
        res[input.name] = input.value
    })
    return res
}


export const showMessage = (message: string, isError?: boolean) => {
    const toast = document.querySelector("#toast")
    if (!toast) return

    toast.innerHTML = message
    if (isError) toast.classList.add("error")
    else toast.classList.remove("error")

    toast.classList.add("show")
    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}


const sumGP = (a: number, n: number) => a * (1 - Math.pow(a, n)) / (1 - a)

export const getBuyPrice = (price: number, n: number) =>
    price * sumGP(1.001, n);

export const getSellPrice = (price: number, n: number) =>
    price * sumGP(1/1.001, n);