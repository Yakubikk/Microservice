import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-blue-600 text-white hover:bg-blue-700',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
                success: 'bg-green-600 text-white hover:bg-green-700',
                warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
                danger: 'bg-red-500 text-white hover:bg-red-600',
                info: 'bg-blue-500 text-white hover:bg-blue-600',
                outline: 'border',
                secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                ghost: 'hover:bg-gray-100',
                link: 'text-blue-600 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2 text-sm',
                sm: 'h-8 px-3 text-xs',
                md: 'h-9 px-4 text-sm',
                lg: 'h-11 px-6 text-base',
                xl: 'h-12 px-8 text-base',
                icon: 'h-10 w-10',
                iconSm: 'h-8 w-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export { buttonVariants };
