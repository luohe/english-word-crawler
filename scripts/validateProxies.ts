import { ProxyService } from '../src/services/proxyService';

async function validateProxies() {
    const proxyService = new ProxyService();
    const proxies = await proxyService.getAllProxies();

    for (const proxy of proxies) {
        const isValid = await proxyService.validateProxy(proxy);
        if (isValid) {
            console.log(`Proxy ${proxy} is valid.`);
            await proxyService.markProxyAsValid(proxy);
        } else {
            console.log(`Proxy ${proxy} is invalid.`);
            await proxyService.markProxyAsInvalid(proxy);
        }
    }
}

validateProxies().catch(error => {
    console.error('Error validating proxies:', error);
    process.exit(1);
});