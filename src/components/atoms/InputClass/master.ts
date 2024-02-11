// eslint-disable-next-line
export namespace Master {
  export const DEF = {
    ウルシ: {
      オペルクリカリア: { パキプス: 'パキプス' },
    },
    キョウチクトウ: {
      パキポディウム: {
        エブレネウム: 'エブレネウム',
        グラキリス: 'グラキリス',
        デンシカウレ: 'デンシカウレ',
        ブレビカウレ: 'ブレビカウレ',
        ラメリー: 'ラメリー',
        ロスラーツム: 'ロスラーツム',
      },
    },
    ススキノキ: {
      ガステリア: {},
    },
    ツルボラン: {
      ハオルチア: {},
    },
    トウダイグサ: {
      ユーフォルビア: {
        オベサ: 'オベサ',
        ゴルゴニス: 'ゴルゴニス',
        スザンナエ: 'スザンナエ',
        峨眉山: '峨眉山',
        稚児キリン: '稚児キリン',
        鉄鋼丸: '鉄鋼丸',
      },
    },
    ハマミズナ: {
      アロイノプシス: {},
      ギバエウム: {},
      コノフィツム: {},
      チタノプシス: {},
      プレイオスピロス: {},
      ラピダリア: {},
      リトープス: {},
    },
    フウロソウ: { ペラルゴニウム: {} },
    ベンケイソウ: { ベンケイソウ: { エケベリア: {}, セダム: {} } },
    ヤマノイモ: { ディオスコレア: { エレファンティペス: {} } },
  } as const;
  export type レベル = '科' | '属' | '種';
  export const 科 = Object.keys(DEF);
  const _属 = Object.values(DEF);
  export const 属 = Object.keys(_属);
  export const 種 = _属.flatMap(i => Object.values(i)).flatMap(i => Object.keys(i));
  export const get = (レベル: レベル) => {
    switch (レベル) {
      case '科':
        return 科;
      case '属':
        return 属;
      case '種':
        return 種;
    }
  };
}
