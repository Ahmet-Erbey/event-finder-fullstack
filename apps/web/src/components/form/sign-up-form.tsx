import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PasswordInput } from '#/components/password-input';
import { Button } from '#/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { cn } from '#/lib/utils';

type SignUpFormProps = HTMLAttributes<HTMLFormElement>;
const LOCAL_REGISTERED_USER_KEY = 'event-finder:registered-user';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Ad en az 2 karakter olmalıdır' }),
  lastName: z.string().min(2, { message: 'Soyad en az 2 karakter olmalıdır' }),
  email: z
    .string()
    .min(1, { message: 'E-posta adresinizi girin' })
    .email({ message: 'Geçersiz e-posta adresi' }),
  password: z
    .string()
    .min(1, { message: 'Şifrenizi girin' })
    .min(8, { message: 'Şifre en az 8 karakter olmalıdır' }),
});

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    window.localStorage.setItem(LOCAL_REGISTERED_USER_KEY, JSON.stringify(data));
    toast.success('Kayıt başarılı. Şimdi giriş yapabilirsin.');
    setIsLoading(false);
    navigate({ to: '/sign-in' });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* Ad & Soyad */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input placeholder="Ayşe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Kaya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input placeholder="ornek@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifre */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
        </Button>
      </form>
    </Form>
  );
}
