// 即時関数でモジュール化
const usersModule = (() => {
  const BASE_URL = "http://localhost:3000/api/v1/users"
  // ヘッダーの設定
  const headers = new Headers()
  headers.set("Content-Type","application/json")

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

      // 結果をJSONで受け取りメッセージを表示
      const resJSON = await res.json()
      alert(resJSON.message)
      
      // 一覧ページへ遷移する
      window.location.href = "/"
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

      // 結果をJSONで受け取りメッセージを表示
      const resJSON = await res.json()
      alert(resJSON.message)
      
      // 一覧ページへ遷移する
      window.location.href = "/"
    },
    // ユーザ削除
    deleteUser: async(uid) => {
      const ret = window.confirm('このユーザを削除しますか？')
      if (!ret) {
        return false
      } else {
        // WebAPIを実行してユーザを追加する（PUT /api/v1/users/:uid）
        const res = await fetch(BASE_URL + "/" + uid, {
          method: "PUT",
          headers: headers
        })

        // 結果をJSONで受け取りメッセージを表示
        const resJSON = await res.json()
        alert(resJSON.message)
        
        // 一覧ページへ遷移する
        window.location.href = "/"

      }

    }
  }

})()
