module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        // ... some other plugins
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            /**
             * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
             */
            '@src': './src',
            '@assets': './src/assets'
          },
          extensions: [
  
            '.android.tsx',
            '.ios.tsx',
            '.native.tsx',
  
            '.android.ts',
            '.ios.ts',
            '.native.ts',
  
            '.android.jsx',
            '.ios.jsx',
            '.native.jsx',
  
            '.android.js',
            '.ios.js',
            '.native.js',
  
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
            '.json'
          ],
        },
      ],
    ],
  };