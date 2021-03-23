// 即時関数でモジュール化
const usersModule = (() => {
  const BASE_URL = "http://localhost:3000/api/v1/users"
  // ヘッダーの設定
  const headers = new Headers()
  headers.set("Content-Type","application/json")

  // error
  const handleError = async (res) => {
    // 結果をJSONで受け取りメッセージを表示
    const resJSON = await res.json()
    switch (res.status) {
      case 200:
        alert(res.status + ": " +resJSON.message)
        // 一覧ページへ遷移する
        window.location.href = "/"
        break;
      case 201:
        alert(res.status + ": " +resJSON.message)
        window.location.href = "/"
        break;
      case 400:
        //  クエリパラメータ間違い　例）ユーザ名が指定されていない。
        alert("400: " +resJSON.error)
        break;
      case 404:
        //  クエリパラメータ間違い　例）ユーザがない。
        alert("404: " + resJSON.error)
        break;
      case 500:
        //  サーバの内部エラー　例）try catch error
        alert("500: " + resJSON.error)
        break;
      default:
        alert(res.status + ": 何らかのエラーが発生しました。")
        break;
    }
  }

  return {
    // ユーザ一覧の表示
    fetchAllUsers: async () => {
      console.log("fetchAllUsers start")
      // fetchは、GETメソッドを実行する。awaitで待つ
      const res = await fetch(BASE_URL);
      const users = await res.json();
      for (let i=0; i< users.length; i++) {
        const user = users[i];
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td><a href="edit.html?uid=${user.id}">編集</a></td>
                      </tr>`
        // beforeend：末尾
        document.getElementById('users-list').insertAdjacentHTML('beforeend',body);
      }
    },
    // ユーザ追加
    createUser: async () => {
      const name = document.getElementById("name").value
      const profile = document.getElementById("profile").value
      const dateofbirth = document.getElementById("date_of_birth").value
      console.log("createUser start")

      // リクエストのbody
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateofbirth
      }

      // WebAPIを実行してユーザを追加する（POST /api/v1/users）
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      })

      return handleError(res)

    },
    // ユーザ情報表示
    setExistingValue: async (uid) => {
      const res = await fetch(BASE_URL + "/" + uid)
      const resJson = await res.json()

      document.getElementById('name').value = resJson.name
      document.getElementById('profile').value = resJson.profile
      document.getElementById('date-of-birth').value = resJson.date_of_birth
    },
    // ユーザ追加
    saveUser: async (uid) => {
      const name = document.getElementById("name").value
      const profile = document.getElementById("profile").value
      const dateofbirth = document.getElementById("date_of_birth").value
      console.log("createUser start")

      // リクエストのbody
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateofbirth
      }

      // WebAPIを実行してユーザを追加する（PUT /api/v1/users/:uid）
      const res = await fetch(BASE_URL + "/" + uid, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)
      })

      return handleError(res)
    },
    // ユーザ削除
    deleteUser: async(uid) => {
      const ret = window.confirm('このユーザを削除しますか？')
      if (!ret) {
        return false
      } else {
        // WebAPIを実行してユーザを追加する（PUT /api/v1/users/:uid）
        const res = await fetch(BASE_URL + "/" + uid, {
          method: "DELETE",
          headers: headers
        })

        return handleError(res)

      }

    }
  }

})()
