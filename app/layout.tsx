import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/context/AuthContext';
import {SseProvider} from '@/context/SseContext';
import {Toaster} from 'react-hot-toast';
import {AmbulancesProvider} from '@/contexts/AmbulancesContext';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'StrokeE - Operator App',
	description: 'Emergency response system for operators',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-customWhite`}>
				<SseProvider>
					<AuthProvider>
						<AmbulancesProvider>{children}</AmbulancesProvider>
					</AuthProvider>
					<Toaster position="top-center" />
				</SseProvider>
			</body>
		</html>
	);
}
