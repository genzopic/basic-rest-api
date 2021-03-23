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

      // 結果を受け取る
      const resJSON = await res.json()
      alert(resJSON.message)
      
      // 一覧ページへ遷移する
      window.location.href = "/"
    }
  }

})()
