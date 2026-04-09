import { createFileRoute, Link } from '@tanstack/react-router';
import { UserAuthForm } from '#components/form/user-auth-form.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#components/ui/card';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
});

function SignIn() {
  return (
    <Card className="gap-4 border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Giriş Yap</CardTitle>
        <CardDescription>
          E-posta ve şifren ile hesabına giriş yap. <br />
          Hesabın yok mu?{' '}
          <Link to="/sign-up" className="hover:text-primary underline underline-offset-4">
            Kayıt Ol
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground px-4 text-center text-sm">
          Giriş yap butonuna basarak{' '}
          <a href="/terms" className="hover:text-primary underline underline-offset-4">
            Kullanım Şartları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="hover:text-primary underline underline-offset-4">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursun.
        </p>
      </CardFooter>
    </Card>
  );
}
