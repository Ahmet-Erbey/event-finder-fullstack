import { Static } from "@sinclair/typebox";
import { Link, useNavigate } from "@tanstack/react-router";
import { t } from "elysia/type-system";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "#/components/password-input";
import { Button } from "#/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { cn } from "#/lib/utils";
import { SESSION_QUERY_KEY } from '#/context/auth-context';
import { signInWithEmail } from "#lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { typeboxResolver } from "#lib/resolver.ts";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = t.Object({
    email: t.String({
        format: "email",
    }),
    password: t.String({
        minLength: 8,
    }),
});

type FormSchema = Static<typeof formSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm<FormSchema>({
        resolver: typeboxResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: FormSchema) {
        try {
            await signInWithEmail({
                email: data.email,
                password: data.password,
            });
            await queryClient.invalidateQueries({ queryKey: [...SESSION_QUERY_KEY] });
            toast.success("Giriş başarılı");
            navigate({ to: "/" });
        } catch (e) {
            const message = e instanceof Error ? e.message : "Giriş başarısız";
            toast.error(message);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("grid gap-3", className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="name@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <Link
                                to="/forgot-password"
                                className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75"
                            >
                                Forgot password?
                            </Link>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-2" disabled={form.formState.isSubmitting}>
                    Login
                </Button>

                {/* <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={form.formState.isSubmitting}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={form.formState.isSubmitting}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
            </form>
        </Form>
    );
}
