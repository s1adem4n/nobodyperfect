import logo from '@/lib/assets/logo.png';

export function Logo() {
	return (
		<img
			src={logo}
			alt="Logo"
			class="h-auto w-full text-transparent"
			width="1078"
			height="498"
			fetchpriority="high"
		/>
	);
}
