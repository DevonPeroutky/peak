This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Installing new dependencies
1. Unlink current `react` and `react-dom` symlinks - `yarn unlink` in both packages in `node_modules`
2. Unlink the component-libary: `yarn unlink` in `component-library`
3. `yarn install` in `peak-blop`
4. Re-add links. `yarn link` in `peak-blog/node_modules/react[-dom]`
5. `yarn link` in component-library
