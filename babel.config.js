// // module.exports = {
// //   "presets": ['@babel/preset-env', '@babel/preset-react', 'module:metro-react-native-babel-preset']
// // };
// //
// module.exports = {
//   presets: [
//     '@babel/preset-env',
//     '@babel/preset-react',
//     // 'module:metro-react-native-babel-preset',
//     // 'module:@babel/plugin-proposal-class-properties',
//   ],
//   plugins: [
//     // "module:react-native-dotenv"
//     'module:metro-react-native-babel-preset',
//     // 'module:@babel/plugin-proposal-class-properties',
//   ]
// };
// // module.exports = {
// //   presets: [
// //     'module:metro-react-native-babel-preset',
// //     [
// //       '@babel/preset-env',
// //       {
// //         targets: {
// //           node: 'current',
// //         },
// //       },
// //     ],
// //   ],
// // };
// // module.exports = {
// //   presets: [
// //     'module:metro-react-native-babel-preset',
// //     ['@babel/preset-env', {targets: {node: 'current'}}],
// //   ],
// // };
//
// // module.exports = {
// //   presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
// // };
//
// // module.exports = {
// //   "env": {
// //   "test": {
// //     "plugins": ["transform-es2015-modules-commonjs"]
// //   }
// // }
// // }
//
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
