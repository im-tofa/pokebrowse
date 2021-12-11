// tokenizer from: https://gist.github.com/borgar/451393/7698c95178898c9466214867b46acb2ab2f56d68
  
  /*
  * Tiny tokenizer
  *
  * - Accepts a subject string and an object of regular expressions for parsing
  * - Returns an array of token objects
  *
  * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, 'invalid');
  * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
  *
  */
  function tokenize ( s, parsers, deftok ) {
    var m, r, l, cnt, t, tokens = [];
    while ( s ) {
        t = null;
        m = s.length;
        for ( var key in parsers ) {
            r = parsers[ key ].exec( s );
            // try to choose the best match if there are several
            // where "best" is the closest to the current starting point
            if ( r && ( r.index < m ) ) {
                t = {
                token: r[ 0 ],
                type: key,
                matches: r.slice( 1 )
                }
                m = r.index;
            }
        }
        if ( m ) {
            // there is text between last token and currently 
            // matched token - push that out as default or "unknown"
            tokens.push({
            token : s.substr( 0, m ),
            type  : deftok || 'unknown'
            });
        }
        if ( t ) {
            // push current token onto sequence
            tokens.push( t ); 
        }
        s = s.substr( m + (t ? t.token.length : 0) );
    }
    return tokens;
  }


  const tokenizer = {
    DATE:/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
    INTLIT:/[1-9]\d*/, 
    WHITESPACE:/\s+/, 
    WORD:/[a-zA-Z]+/,
    CMD: /\/(species|author|speed|date)/
  };
  
  const parseInput = (input) => {
    let tokens = tokenize(input, tokenizer, 'invalid');
    tokens = tokens.filter(el => el.type != "WHITESPACE");
    console.log(tokens);
    let i = 0;
    if(i < tokens.length){
      switch (tokens[i].type) {
        case 'CMD':
          console.log("HELLOOO");
          let key = "";
          let val = "";
          let inputType = "";
          switch (tokens[i].token) {
            case '/species':
              i++;
              key = "species";
              inputType = "text";
              if(i < tokens.length){
                while(i < tokens.length) {
                  if(tokens[i].type === "WORD") {
                    val += tokens[i].token + " ";
                  } else {
                    console.log("got token of type '" + tokens[i].type + "'; expected a word (e.g Excadrill)");
                    return null;
                  }
                  i++;
                }
              } else {
                console.log("command ended early; expected a word (e.g Excadrill)");
              }
              val = val.toLowerCase().trim();
              break;
            case '/author':
              i++;
              key = "author";
              inputType = "text";
              if(i < tokens.length){
                while(i < tokens.length) {
                  if(tokens[i].type === "WORD") {
                    val += tokens[i].token + " ";
                  } else {
                    console.log("got token of type '" + tokens[i].type + "'; expected a word (e.g finchinator)");
                    return null;
                  }
                  i++;
                }
              } else {
                console.log("command ended early; expected a word (e.g finchinator)");
              }
              val = val.toLowerCase().trim();
              break;
            case '/speed':
              i++;
              key = "speed";
              inputType = "number";
              if(i < tokens.length){
                if(tokens[i].type === "INTLIT") {
                  val = parseInt(tokens[i].token);
                } else {
                  console.log("got token of type '" + tokens[i].type + "'; expected a number (e.g 290)");
                  return null;
                }
                i++;
              } else {
                console.log("command ended early; expected a number (e.g 290)");
              }
              break;
            case '/date':
              i++;
              key = "date";
              inputType = "date";
              if(i < tokens.length){
                if(tokens[i].type === "DATE") {
                  val = tokens[i].token;
                } else {
                  console.log("got token of type '" + tokens[i].type + "'; expected a date (e.g 2020-04-05)");
                  return null;
                }
                i++;
              } else {
                console.log("command ended early; expected a date (e.g 2020-04-05)");
              }
              break;
          }
          return {key: key, val: val, inputType: inputType};
        default:
          console.log("unexpected command: expected /species, /author, /speed or /date.");
          return null;
      }
    }
    return null;
  };
export default parseInput;