#!/usr/bin/env node
var sys = require('sys'),
    words = process.argv.slice(2).join(' '),
    request, body, parse, chunks;
    
if (words === ""){
  sys.puts('Please enter a word / phrase to search for');
} else {
  request = require('http').createClient(80, 'google.com')
              .request('GET', '/search?q=' + encodeURIComponent('define:' + words))
              .addListener('response', function(response){
                response.addListener('data', function(chunk){
                  body += chunk;
                });
                response.addListener('end', function(){
                  parse();
                })
              }).end();
  
  chunks = function(text, length){
    if (text.length <= length) return [text];
    var ret = []; 
    text.split("\n").forEach(function(t){
      for (var i = 0; i < Math.ceil(t.length / length); i++){
        ret.push(t.slice(i * length, (i + 1) * length));
      }
    });
    return ret;
  };
  
  parse = function(){
    var list = body.match(/<ul type="disc" class=std>(.*)<\/ul>/), dds;
    if (list && list[1]){
      dds = list[1].split('<li>').forEach(function(d){
        d = d.replace(/<br>/, "\n")
             .replace(/<([^>]+)>/gmi, '')
             .replace(/&amp;/gmi, '&')
             .replace(/&quot;/gmi, '"')
             .replace(/&gt;/gmi, '>')
             .replace(/&#39;/gmi, "'")
             .replace(/&lt;/gmi, '<');
        if (d) sys.puts(chunks('• ' + d, 100).join("\n") + "\n");
      })
    } else {
      sys.puts('No results for: ' + words);
    }
  };
}