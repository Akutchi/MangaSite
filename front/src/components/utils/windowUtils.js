export function isOnMobile(setIsMobile) {

   let handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
   handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}