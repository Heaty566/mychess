export interface Router {
    label: string;
    href: string;
}

const router: Array<Router> = [
    {
        href: '/login',
        label: 'Login',
    },
];

export default router;
