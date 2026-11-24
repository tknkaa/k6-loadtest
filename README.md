# k6-loadtest

GitHub Actions のランナーから、HTTP の POST に対する負荷試験を流す。k6 を使う。

- `k6/ramp.js`: 件/秒を段階的に上げる。段は `rates`、各段の時間は `stage_duration` で指定する。
- `k6/burst.js`: 指定した件数を、全ランナーで同じ時刻に 1 回ずつ送る。
- `shards` 台のランナーで 1/shards ずつ流す。

試験先の URL や認証などは、すべて Actions の secrets で渡す。リポジトリには入れない。

| secret | 内容 |
| --- | --- |
| `BASE_URL` | 試験先の origin |
| `ENDPOINT` | POST するパス |
| `BODY_TEMPLATE` | リクエスト body。`__N__` が顧客の番号 (1 から `customers` まで) に置き換わる |
| `EXTRA_HEADERS` | 追加ヘッダーの JSON (任意) |
| `SUCCESS_MARKER` | 成功とみなす応答 body に含まれる文字列 (任意) |
| `BASIC_AUTH` | Basic 認証の `user:password` (任意) |

実行は Actions の loadtest を workflow_dispatch で流す。k6 の出力と raw.csv.gz は artifact に残る。URL や認証情報は、出力から取り除いてから残す。
