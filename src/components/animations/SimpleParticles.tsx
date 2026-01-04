import { useEffect, useRef } from 'react';

interface SimpleParticlesProps {
    count?: number;
}

const SimpleParticles = ({ count = 50 }: SimpleParticlesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedY: number;
            opacity: number;
        }> = [];

        // Create particles
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedY: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.3 + 0.2,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.y += p.speedY;
                if (p.y > canvas.height) p.y = 0;

                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-50"
            style={{ opacity: 0.4 }}
        />
    );
};

export default SimpleParticles;
