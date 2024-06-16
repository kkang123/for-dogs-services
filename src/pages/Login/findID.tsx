export default function FindID() {
  return (
    <>
      <div>
        <label
          className="block mb-2 text-sm font-bold text-gray-700 text-left"
          htmlFor="email"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          name="nickname"
          // value={email}
          // onChange={onChange}
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder="이름을 입력해주세요."
        />
      </div>
    </>
  );
}
