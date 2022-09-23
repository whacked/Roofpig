{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.yarn
  ];  # join lists with ++

  nativeBuildInputs = [
    ~/setup/bash/nix_shortcuts.sh
    ~/setup/bash/node_shortcuts.sh
  ];

  shellHook = ''
    activate-yarn-env
    echo-shortcuts ${__curPos.file}
    alias build='gulp build'
  '';  # join strings with +
}
