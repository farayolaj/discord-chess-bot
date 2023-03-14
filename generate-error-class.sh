if [$1 -eq ""]; then
  echo "Add error name"
  return 1
fi

if [$2 -eq ""]; then
  echo "Add error message"
  return 1
fi

echo "import GameError, { ErrorData } from \"./GameError\";

class $1Error extends GameError {
  constructor(data: ErrorData) {
    super({ ...data, message: \"$2\" });
    this.name = \"$1Error\";
  }
}

export default $1Error;

" >"src/errors/$1.ts"

echo "Error class generated"
